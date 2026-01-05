import { useCallback, useEffect, useState, useRef } from 'react'
import { Divider, Form, Input, Button, type FormProps, notification } from 'antd'
import { CodeOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import apiClient from '@/lib/axios'
import iconArrowLeft from '@/assets/icon/icon_arrow_left.png'
import './antiAutofill.css'

export const ForgetPasswordForm = ({ togglePanel }: { togglePanel: (mode: string) => void }) => {
  const [form] = Form.useForm()
  const [countdown, setCountdown] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [api, contextHolder] = notification.useNotification()

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // 防自动填充策略
  const setupAntiAutofill = useCallback(() => {
    // 延迟执行，确保DOM已经渲染
    setTimeout(() => {
      const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
        'input[type="text"], input[type="password"], input[type="email"]'
      )
      inputs.forEach(input => {
        // 设置 autocomplete 属性为随机值
        input.setAttribute('autocomplete', `new-${Math.random().toString(36).substring(2, 11)}`)
        input.setAttribute('autocorrect', 'off')
        input.setAttribute('autocapitalize', 'off')
        input.setAttribute('spellcheck', 'false')

        // 监听自动填充事件
        input.addEventListener('animationstart', e => {
          if ((e as AnimationEvent).animationName === 'onAutoFillStart') {
            // 检测到自动填充时，清空输入框
            input.value = ''
            // 触发 React 的响应式更新
            if (input.name === 'mobile') {
              form.setFieldValue('mobile', '')
            } else if (input.name === 'newPwd') {
              form.setFieldValue('newPwd', '')
            } else if (input.name === 'code') {
              form.setFieldValue('code', '')
            }
          }
        })
      })
    }, 100)
  }, [form])
  useEffect(() => {
    setupAntiAutofill()
  }, [setupAntiAutofill])

  const doResetPassword = async (values: {
    mobile: string
    code: string
    newPwd: string
    token?: string
  }) => {
    try {
      const options = {
        method: 'POST',
        url: '/component/forgetPwd/reset',
        data: values,
      }
      const res = await apiClient.request(options)

      if (res.data.code === 200) {
        //修改成功
        api.success({
          title: '提示',
          description: '修改成功',
        })
        // 立即切换回登录面板
        setTimeout(() => {
          togglePanel('login')
        }, 500)
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
    mobile: string
    code: string
    newPwd: string
    token?: string
  }>['onFinish'] = values => {
    console.log('Success:', values)
    doResetPassword(values)
  }

  const getMessageCode = async () => {
    try {
      const regExp = new RegExp('^1[3-9]\\d{9}$')

      if (regExp.test(form.getFieldValue('mobile'))) {
        const options = {
          method: 'POST',
          url: '/component/mobile/captcha',
          data: { mobile: form.getFieldValue('mobile') },
        }
        const res = await apiClient.request(options)
        console.log(res)
        if (res.data.code === 200) {
          api.success({
            title: '提示',
            description: '验证码己发送，请及时查收',
          })
          form.setFieldValue('token', res.data.data.token)

          // 清理之前的定时器
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }

          setCountdown(60)
          timerRef.current = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                // 倒计时结束
                if (timerRef.current) {
                  clearInterval(timerRef.current)
                  timerRef.current = null
                }
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } else {
          api.error({
            title: '提示',
            description: res.data.message,
          })
        }
      } else {
        api.warning({
          title: '提示',
          description: '请输入正确手机号',
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
        <div className="flex justify-between items-center">
          <div className="text-[24px] text-[#111111] font-bold">忘记密码</div>
          <div
            className="py-2 px-4 rounded-md flex justify-center items-center cursor-pointer bg-[#E9F1FF] border-[#CADDFC]"
            onClick={() => togglePanel('login')}
          >
            <div className="bg-[#CADDFC] w-6 h-6 flex justify-center items-center rounded">
              <img src={iconArrowLeft} alt="" className="w-[16px] h-[16px]" />
            </div>
            <div className="text-[#9E9E9E] text-[#3A83FC]! font-bold ml-1">登录</div>
          </div>
        </div>
        <Divider size="small" />
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item label="手机号" name="mobile" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
            <Input
              placeholder="请输入验证码"
              prefix={<CodeOutlined />}
              suffix={
                <div className="relative inline-block">
                  <Button
                    disabled={countdown > 0}
                    color="green"
                    variant="solid"
                    size="small"
                    onClick={getMessageCode}
                  >
                    获取验证码
                  </Button>
                  {countdown > 0 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded pointer-events-none text-[#9E9E9E] font-bold flex justify-center items-center">
                      {countdown}秒
                    </div>
                  )}
                </div>
              }
            />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPwd"
            rules={[
              {
                required: true,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
                message: '密码必须包含大小写字母、数字和特殊字符，长度是6到16位。',
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="token" hidden>
            <Input type="hidden" />
          </Form.Item>
          <div className="my-6">
            <div className="bg-[#FEF7E3] text-[#FDAD00] p-2 rounded-md">
              提示：密码必须包含大小写字母、数字和特殊字符，长度是6到16位。
            </div>
          </div>
          <Form.Item>
            <Button type="primary" block htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
