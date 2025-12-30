import { createFileRoute } from '@tanstack/react-router'
import logoTitle from '@/assets/img/logo_title.png'
import iconManage from '@/assets/icon/icon_manage.png'
import { Alert, Divider, Form, Input, Button, type FormProps, Checkbox } from 'antd'
import { useState } from 'react'
import { CodeOutlined, LockOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import apiClient from '../lib/axios'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [msg, setMsg] = useState<string | null>(null)
  const [captchaImg, setCaptchaImg] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [form] = Form.useForm()

  const onFinish: FormProps<{
    username: string
    password: string
    code: string
  }>['onFinish'] = values => {
    console.log('Success:', values)
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
        setMsg(null)
      } else {
        setMsg(result.data.message)
      }
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  return (
    <div className="w-full h-full bg-[url(@/assets/img/bg_login.png)] bg-no-repeat bg-size-[100%_100%]">
      <div className="fixed left-[35px] top-[40px] flex items-center">
        <img src={logoTitle} className="w-[523px]" alt="logo" />
        <img src={iconManage} className="w-[162px] h-[52px] ml-5" alt="" />
      </div>
      <div className="flex justify-end w-full h-full">
        <div className="flex-1"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[498px] h-[598px] bg-[url(@/assets/img/bg_loginBox.png)] bg-no-repeat bg-size-[100%_100%] px-[35px] flex flex-col justify-center">
            <div className="text-[24px] text-[#111111] font-bold">登录平台</div>
            <Divider size="small" />
            {msg && (
              <Alert
                title={msg}
                type="error"
                className="mb-4"
                closable={{ closeIcon: true, 'aria-label': 'close' }}
              />
            )}
            <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
              <Form.Item label="账号" name="username" rules={[{ required: true }]}>
                <Input placeholder="请输入账号" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入验证码"
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
                  <Button color="primary" variant="filled">
                    忘记密码
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center fixed! bottom-[60px]">
        <div>主办单位：南通高新区企业发展和人才服务中心</div>
        <div className="w-[109px]"></div>
        <div>技术支持：江苏瀚天智能科技股份有限公司</div>
      </div>
    </div>
  )
}
