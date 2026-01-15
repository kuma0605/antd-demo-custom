import { createFileRoute } from '@tanstack/react-router'
import { Form, Input, Select, Space } from 'antd'

export const Route = createFileRoute('/_layout/systemSetting/registeredUserManagement')({
  component: RouteComponent,
})

function RouteComponent() {
  const [form] = Form.useForm()
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 70 }}
        defaultValue={'86'}
        options={[
          { label: '+86', value: '86' },
          { label: '+87', value: '87' },
        ]}
      />
    </Form.Item>
  )
  return (
    <>
      <div className="px-[40px] py-[30px]">
        <div>
          <Form form={form} layout="inline" colon={false}>
            <Form.Item label="姓名" name="name">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="账号" name="account">
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              {/* Demo only, real usage should wrap as custom component */}
              <Space.Compact block>
                {prefixSelector}
                <Input style={{ width: '100%' }} />
              </Space.Compact>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
