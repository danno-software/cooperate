import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import Layout from './Layout.tsx'
import App from './App.tsx'

const About = lazy(() => import('./About.tsx'))
const Services = lazy(() => import('./Services.tsx'))
const Blog = lazy(() => import('./Blog.tsx'))
const BlogPost = lazy(() => import('./BlogPost.tsx'))
const NotFound = lazy(() => import('./NotFound.tsx'))

export function RootApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
