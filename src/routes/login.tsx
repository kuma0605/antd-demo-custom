import { createFileRoute } from '@tanstack/react-router'
import logoTitle from '@/assets/img/logo_title.png'
import iconManage from '@/assets/icon/icon_manage.png'
import { LoginForm } from '@/components/LoginForm'
import { useState } from 'react'
import { ForgetPasswordForm } from '@/components/ForgetPasswordForm'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [panelMode, setPanelMode] = useState('login')

  const togglePanel = (mode: string) => {
    // 先切换面板模式
    setPanelMode(mode)
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
          {panelMode === 'login' ? (
            <LoginForm togglePanel={togglePanel} />
          ) : (
            <ForgetPasswordForm togglePanel={togglePanel} />
          )}
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
