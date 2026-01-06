import { useMemo, useState } from 'react'
import { Divider, Form, Input, Button, type FormProps, Checkbox, notification } from 'antd'
import { CodeOutlined, LockOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import apiClient from '@/lib/axios'
import { useUserStore } from '@/stores/useUserStore'
import { useNavigate } from '@tanstack/react-router'

export const LoginForm = ({ togglePanel }: { togglePanel: (mode: string) => void }) => {
  const [captchaImg, setCaptchaImg] = useState<string | null>(null)
  // 使用初始化函数，避免在 useEffect 中调用 setState
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      const rememberMeStr = localStorage.getItem('rememberMe')
      return rememberMeStr === 'true'
    } catch {
      return false
    }
  })
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [api, contextHolder] = notification.useNotification()

  // 使用 useMemo 计算表单初始值（只在组件挂载时计算一次）
  const initialValues = useMemo(() => {
    const isRememberMe = localStorage.getItem('rememberMe') === 'true'
    if (isRememberMe) {
      return {
        username: localStorage.getItem('username') || undefined,
        password: localStorage.getItem('password') || undefined,
      }
    }
    return {}
  }, []) // 空依赖数组，只在组件挂载时计算一次

  const doLogin = async (values: {
    username: string
    password: string
    code: string
    token?: string
  }) => {
    try {
      // 清空token
      localStorage.removeItem('token')

      const options = {
        method: 'POST',
        url: '/login/code',
        data: values,
      }
      const res = await apiClient.request(options)

      if (res.data.code === 200) {
        // 1.存储用户信息
        useUserStore.getState().login(res.data.data.user, res.data.data.token)

        // 2.登录成功后再保存"记住密码"（安全：只在登录成功时保存）
        if (rememberMe) {
          localStorage.setItem('username', values.username)
          // 注意：密码明文存储有安全风险，生产环境建议加密或使用 token
          localStorage.setItem('password', values.password)
          localStorage.setItem('rememberMe', 'true')
        } else {
          // 取消记住密码时，清除已保存的信息
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.removeItem('rememberMe')
        }

        // 3.跳转到首页
        navigate({ to: '/index', replace: true })
      } else {
        api.error({
          title: '提示',
          description: res.data.message,
        })
      }
    } catch (e) {
      api.error({
        title: '提示',
        description: (e as Error).message,
      })
    }
  }

  const onFinish: FormProps<{
    username: string
    password: string
    code: string
    token?: string
  }>['onFinish'] = values => {
    // 现在 values 包含所有字段，包括隐藏的 token
    console.log('Success:', values)
    doLogin(values)
  }

  const getCaptcha = async () => {
    try {
      const options = {
        method: 'POST',
        url: '/component/captcha',
      }
      const result = await apiClient.request(options)
      if (result.data.code === 200) {
        form.setFieldValue('token', result.data.data.token)
        setCaptchaImg(result.data.data.base64)
      } else {
        api.error({
          title: '提示',
          description: result.data.message,
        })
      }
    } catch (e) {
      api.error({
        title: '提示',
        description: (e as Error).message,
      })
    }
  }

  return (
    <>
      {contextHolder}
      <div className="w-[498px] h-[598px] bg-[url(@/assets/img/bg_loginBox.png)] bg-no-repeat bg-size-[100%_100%] px-[35px] flex flex-col justify-center">
        <div className="text-[24px] text-[#111111] font-bold">登录平台</div>
        <Divider size="small" />
        <Form
          layout="vertical"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item label="账号" name="username" rules={[{ required: true }]}>
            <Input placeholder="请输入账号" allowClear prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" allowClear prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
            <Input
              placeholder="请输入验证码"
              allowClear
              prefix={<CodeOutlined />}
              suffix={
                captchaImg ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={captchaImg}
                      alt="验证码"
                      className="w-[54px] h-[27px] scale-125 origin-center"
                    />
                    <ReloadOutlined onClick={getCaptcha} className="cursor-pointer" />
                  </div>
                ) : (
                  <Button color="green" variant="solid" size="small" onClick={getCaptcha}>
                    获取验证码
                  </Button>
                )
              }
            />
          </Form.Item>
          {/* 隐藏字段：存储验证码 token */}
          <Form.Item name="token" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-between">
              <Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}>
                记住密码
              </Checkbox>
              <Button
                color="primary"
                variant="filled"
                onClick={() => togglePanel('forgetPassword')}
              >
                忘记密码
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
