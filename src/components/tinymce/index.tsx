import { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { message } from 'antd'
import { uploadFile } from '../../api/upload'

// 引入 TinyMCE 核心和必需模块
import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

export default function MyEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const [uploading, setUploading] = useState(false)

  // 处理文件上传并插入编辑器
  const handleFileUpload = async (editor: TinyMCEEditor, file: File) => {
    const fileType = file.type

    // 检查文件类型
    if (!fileType.startsWith('video/') && !fileType.startsWith('image/')) {
      message.warning('不支持的文件类型，仅支持图片和视频')
      return
    }

    // 检查文件大小（例如：限制 100MB）
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      message.error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`)
      return
    }

    setUploading(true)
    const loadingMessage = message.loading('正在上传文件...', 0)

    try {
      // 上传文件到服务器
      const response = await uploadFile(file, progress => {
        // 可以在这里更新进度（如果需要显示进度条）
        console.log(`上传进度: ${progress}%`)
      })

      // 上传成功，插入到编辑器
      if (fileType.startsWith('video/')) {
        const videoHtml = `<video controls width="100%"><source src="${response.url}" type="${fileType}"></video>`
        editor.insertContent(videoHtml)
        message.success('视频上传成功')
      } else if (fileType.startsWith('image/')) {
        editor.insertContent(`<img src="${response.url}" alt="${response.filename}" />`)
        message.success('图片上传成功')
      }

      loadingMessage()
    } catch (error) {
      console.error('上传失败:', error)
      message.error('文件上传失败，请重试')
      loadingMessage()
    } finally {
      setUploading(false)
    }
  }

  // 处理文件拖拽和粘贴
  const handleFileDrop = (editor: TinyMCEEditor, files: FileList) => {
    if (uploading) {
      message.warning('正在上传中，请稍候...')
      return
    }

    Array.from(files).forEach(file => {
      handleFileUpload(editor, file)
    })
  }

  return (
    <Editor
      // 重要：设置 licenseKey 为 'gpl' 使用 GPL 版本（本地版本）
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = editor

        // 添加拖拽事件监听
        const editorBody = editor.getBody()
        if (editorBody) {
          // 阻止默认的拖拽行为，允许拖拽文件
          editorBody.addEventListener('dragover', e => {
            e.preventDefault()
            e.stopPropagation()
            // 添加拖拽样式提示
            editorBody.style.opacity = '0.8'
          })

          editorBody.addEventListener('dragleave', () => {
            editorBody.style.opacity = '1'
          })

          // 处理文件拖拽
          editorBody.addEventListener('drop', e => {
            e.preventDefault()
            e.stopPropagation()
            editorBody.style.opacity = '1'

            const files = e.dataTransfer?.files
            if (files && files.length > 0) {
              handleFileDrop(editor, files)
            }
          })

          // 处理粘贴文件
          editorBody.addEventListener('paste', e => {
            const files = e.clipboardData?.files
            if (files && files.length > 0) {
              e.preventDefault()
              handleFileDrop(editor, files)
            }
          })
        }
      }}
      initialValue="<p>这里是初始内容...</p>"
      init={{
        height: 500,
        menubar: true,

        // 关键：配置 base_url 指向本地资源，避免连接云端
        base_url: '/tinymce',
        suffix: '', // 不使用 .min 后缀，使用完整版本

        // 配置语言
        language: 'zh_CN',
        // 告诉它去哪里找翻译文件 (相对于 base_url 的路径)
        language_url: '/tinymce/langs/zh_CN.js',

        // 配置本地资源路径 (防止去请求云端)
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',

        // 禁用云端服务和品牌标识（重要：避免许可证检查）
        promotion: false,
        branding: false,

        // 强制禁用许可证管理器插件
        forced_plugins: [],

        // 插件配置 (按需增减)
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          //   'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | media image | help',

        // 支持粘贴图片（base64）
        paste_data_images: true,

        // 文件选择回调（用于工具栏按钮）
        file_picker_callback: (_callback, _value, meta) => {
          if (meta.filetype === 'media') {
            // 创建文件输入
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'video/*,audio/*')
            input.onchange = async e => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file && editorRef.current) {
                await handleFileUpload(editorRef.current, file)
                // 上传成功后，使用返回的 URL
                // 注意：这里需要等待上传完成，实际 URL 在 handleFileUpload 中已插入
              }
            }
            input.click()
          } else if (meta.filetype === 'image') {
            // 图片选择
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.onchange = async e => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file && editorRef.current) {
                await handleFileUpload(editorRef.current, file)
                // 上传成功后，使用返回的 URL
                // 注意：这里需要等待上传完成，实际 URL 在 handleFileUpload 中已插入
              }
            }
            input.click()
          }
        },
      }}
    />
  )
}
