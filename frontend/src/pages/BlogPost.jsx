import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Layout/Navbar';
import { getBlogPost } from '../utils/api';
import './Blog.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const res = await getBlogPost(slug);
        setPost(res.data?.data || null);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <Navbar />
        <div className="blog-empty" style={{ minHeight: '50vh' }}>
          <Icon icon="mdi:loading" width={28} height={28} className="blog-spin" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-page">
        <Navbar />
        <div className="blog-empty" style={{ minHeight: '50vh' }}>
          <Icon icon="mdi:file-remove-outline" width={28} height={28} />
          <p>Post not found.</p>
          <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <Navbar />
      <article className="blog-post-detail">
        <div className="blog-post-detail-container">
          <Link to="/blog" className="blog-back-link">
            <Icon icon="mdi:arrow-left" width={16} height={16} /> Back to Blog
          </Link>

          <div className="blog-post-hero">
            {/* Cover Image on Top */}
            <div className="blog-post-hero-image">
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt={post.title} />
              ) : (
                <div className="blog-post-hero-image-fallback">
                  <Icon icon="mdi:image-outline" width={48} height={48} />
                </div>
              )}
            </div>

            {/* Post Info Below Image */}
            <div className="blog-post-hero-content">
              {!!post.tags?.length && (
                <div className="blog-card-tags">
                  {post.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              )}

              <h1 className="blog-post-title">{post.title}</h1>
              
              <div className="blog-card-meta">
                <Icon icon="mdi:account-circle" width={18} height={18} />
                <span>{post.author?.name || 'WeIntern Team'}</span>
                <span>·</span>
                <Icon icon="mdi:calendar" width={16} height={16} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Full Content Below */}
          <div className="blog-post-content">
            {post.content.split('\n').map((para, i) => (para.trim() ? <p key={i}>{para}</p> : null))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
