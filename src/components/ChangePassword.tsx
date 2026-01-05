import { useEffect } from 'react'
import { apiClient } from '@/lib/axios'
import { LockOutlined } from '@ant-design/icons'
import { Form, Input, notification, Modal } from 'antd'

export const ChangePassword = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()

  // 当 Modal 打开时，重置表单
  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open, form])

  const onFinish = async (values: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    console.log(values)

    try {
      const requestData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }
      const res = await apiClient.request({
        method: 'POST',
        url: '/sys/user/updatePassword',
        data: requestData,
      })
      if (res.data.code === 200) {
        api.success({
          title: '提示',
          description: '修改成功',
        })
        form.resetFields() // 成功提交后重置表单
        setOpen(false)
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
      <Modal
        open={open}
        title="修改密码"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => {
          form.resetFields() // 取消时也重置表单
          setOpen(false)
        }}
        afterClose={() => {
          form.resetFields() // Modal 完全关闭后重置表单（双重保险）
        }}
        modalRender={dom => (
          <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
            {dom}
          </Form>
        )}
      >
        <div className="custom-form-body">
          <Form.Item name="oldPassword" label="原密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入原密码" allowClear prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              {
                required: true,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
                message: '密码必须包含大小写字母、数字和特殊字符，长度是6到16位。',
              },
            ]}
          >
            <Input.Password placeholder="请输入新密码" allowClear prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入确认密码" allowClear prefix={<LockOutlined />} />
          </Form.Item>
        </div>
        <div className="mt-2 text-gray">
          注意：密码必须包含大小写字母、数字和特殊字符，长度是6到16位。
        </div>
      </Modal>
    </>
  )
}
