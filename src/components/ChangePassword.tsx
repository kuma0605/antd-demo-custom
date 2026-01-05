import { apiClient } from '@/lib/axios'
import { LockOutlined } from '@ant-design/icons'
import { Form, Input, Space, Button, notification } from 'antd'

export const ChangePassword = () => {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const onFinish = async (values: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    console.log(values)
    try {
      const options = {
        method: 'POST',
        url: '/component/changePwd',
        data: values,
      }
      const res = await apiClient.request(options)
      if (res.data.code === 200) {
        api.success({
          title: '提示',
          description: '修改成功',
        })
      } else {
        api.error({
          title: '提示',
          description: res.data.message,
        })
      }
    } catch (error) {
      api.error({
        title: '提示',
        description: (error as Error).message,
      })
    }
  }
  return (
    <>
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
        <div className="custom-form-body">
          <Form.Item name="oldPassword" label="原密码">
            <Input placeholder="请输入原密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码">
            <Input placeholder="请输入新密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认密码">
            <Input placeholder="请输入确认密码" prefix={<LockOutlined />} />
          </Form.Item>
        </div>
        <div className="mt-2 text-gray">
          注意：密码必须包含大小写字母、数字和特殊字符，长度是6到16位。
        </div>
        <div className="flex justify-end mt-8">
          <Space size="small">
            <Button variant="outlined" onClick={() => {}}>
              取消
            </Button>
            <Button type="primary">提交</Button>
          </Space>
        </div>
      </Form>
    </>
  )
}
