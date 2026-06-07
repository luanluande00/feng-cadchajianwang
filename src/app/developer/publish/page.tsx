'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlitchText } from '@/components/cyberpunk/GlitchText';
import { ArrowLeft, Upload, X, ImagePlus, Video, FileUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PublishPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '工具',
    price: 0,
    coverImage: '',
    fileUrl: '',
    productImages: '',
    productVideo: '',
  });

  const categories = ['工具', '标注', '导出', '定制', '渲染', '参数化', '其他'];

  // 通用文件上传函数
  const uploadFile = async (file: File, type: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      } else {
        setError(data.message);
        return null;
      }
    } catch {
      setError('上传失败，请重试');
      return null;
    }
  };

  // 上传封面图
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError('');
    const url = await uploadFile(file, 'image');
    if (url) setForm({ ...form, coverImage: url });
    setUploadingCover(false);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // 上传产品介绍图片（支持多张）
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    setError('');

    const currentImages = form.productImages ? form.productImages.split(',').filter(Boolean) : [];
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (currentImages.length + newUrls.length >= 10) {
        setError('最多上传10张产品图片');
        break;
      }
      const url = await uploadFile(files[i], 'image');
      if (url) newUrls.push(url);
    }

    if (newUrls.length > 0) {
      const allImages = [...currentImages, ...newUrls].join(',');
      setForm({ ...form, productImages: allImages });
    }
    setUploadingImages(false);
    if (imagesInputRef.current) imagesInputRef.current.value = '';
  };

  // 上传产品视频
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('视频大小不能超过10MB');
      return;
    }
    setUploadingVideo(true);
    setError('');
    const url = await uploadFile(file, 'video');
    if (url) setForm({ ...form, productVideo: url });
    setUploadingVideo(false);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // 上传插件文件
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setError('');
    const url = await uploadFile(file, 'plugin');
    if (url) setForm({ ...form, fileUrl: url });
    setUploadingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 删除产品图片
  const removeImage = (index: number) => {
    const images = form.productImages.split(',').filter(Boolean);
    images.splice(index, 1);
    setForm({ ...form, productImages: images.join(',') });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('请输入插件名称'); return; }
    if (!form.description.trim()) { setError('请输入插件描述'); return; }
    if (form.description.trim().length < 10) { setError('插件描述至少10个字符'); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/plugins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('插件发布成功！');
        setTimeout(() => router.push('/developer/plugins'), 1500);
      } else {
        setError(data.message);
      }
    } catch {
      setError('提交失败');
    } finally {
      setLoading(false);
    }
  };

  const productImagesList = form.productImages ? form.productImages.split(',').filter(Boolean) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/developer" className="inline-flex items-center gap-2 text-cyber-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> 返回开发者中心
      </Link>

      <GlitchText className="font-orbitron text-3xl font-bold mb-8 glow-text text-cyber-blue">发布插件</GlitchText>

      <Card glow>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 插件名称 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件名称 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              placeholder="请输入插件名称"
              required
            />
          </div>

          {/* 插件描述 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件描述 *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              rows={4}
              placeholder="请输入插件功能描述（至少10个字符）"
              required
            />
          </div>

          {/* 分类和价格 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">分类</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">价格（积分）</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full p-3 bg-cyber-input border border-cyber-blue/30 rounded text-white focus:outline-none focus:border-cyber-blue"
                min="0"
                required
              />
            </div>
          </div>

          {/* 封面图上传 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">封面图</label>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            {form.coverImage ? (
              <div className="relative group">
                <img src={form.coverImage} alt="封面" className="w-full h-48 object-cover rounded border border-cyber-blue/30" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverImage: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="w-full h-48 border-2 border-dashed border-cyber-blue/30 rounded flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-cyber-blue/60 hover:text-cyber-blue transition-all"
              >
                {uploadingCover ? (
                  <><Loader2 className="h-8 w-8 animate-spin" /><span>上传中...</span></>
                ) : (
                  <><ImagePlus className="h-8 w-8" /><span>点击上传封面图</span><span className="text-xs">支持 JPG/PNG/GIF/WebP，最大5MB</span></>
                )}
              </button>
            )}
          </div>

          {/* 产品介绍图片上传 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">
              产品介绍图片 <span className="text-gray-500 text-sm normal-case">（最多10张）</span>
            </label>
            <input ref={imagesInputRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
            <div className="grid grid-cols-3 gap-3 mb-3">
              {productImagesList.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt={`产品图${i + 1}`} className="w-full h-full object-cover rounded border border-cyber-blue/30" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {productImagesList.length < 10 && (
                <button
                  type="button"
                  onClick={() => imagesInputRef.current?.click()}
                  disabled={uploadingImages}
                  className="aspect-square border-2 border-dashed border-cyber-blue/30 rounded flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-cyber-blue/60 hover:text-cyber-blue transition-all"
                >
                  {uploadingImages ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <><ImagePlus className="h-6 w-6" /><span className="text-xs">添加图片</span></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 产品视频上传 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">
              产品介绍视频 <span className="text-gray-500 text-sm normal-case">（可选，最大10MB，自动播放）</span>
            </label>
            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" onChange={handleVideoUpload} className="hidden" />
            {form.productVideo ? (
              <div className="relative group">
                <video
                  src={form.productVideo}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full rounded border border-cyber-blue/30"
                  style={{ maxHeight: '300px' }}
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, productVideo: '' })}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="w-full h-24 border-2 border-dashed border-cyber-blue/30 rounded flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-cyber-blue/60 hover:text-cyber-blue transition-all"
              >
                {uploadingVideo ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /><span>上传中...</span></>
                ) : (
                  <><Video className="h-6 w-6" /><span>点击上传视频</span><span className="text-xs">MP4/WebM，最大10MB</span></>
                )}
              </button>
            )}
          </div>

          {/* 插件文件上传 */}
          <div>
            <label className="block text-gray-400 mb-2 font-rajdhani uppercase tracking-wider">插件文件</label>
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="flex items-center gap-2 px-4 py-3 bg-cyber-input border border-cyber-blue/30 rounded text-gray-400 hover:border-cyber-blue/60 hover:text-cyber-blue transition-all"
              >
                {uploadingFile ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> 上传中...</>
                ) : (
                  <><FileUp className="h-4 w-4" /> 选择文件</>
                )}
              </button>
              {form.fileUrl && (
                <span className="text-green-500 text-sm flex items-center gap-1">
                  ✓ 文件已上传
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">支持 .lsp, .vlx, .fas, .zip 等格式，最大50MB</p>
          </div>

          {/* 错误和成功提示 */}
          {error && <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">{error}</div>}
          {success && <div className="p-3 bg-green-500/20 border border-green-500 rounded text-green-500 text-sm">{success}</div>}

          {/* 提交按钮 */}
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} glow>
            <Upload className="h-5 w-5 mr-2" />
            发布插件
          </Button>
        </form>
      </Card>
    </div>
  );
}
