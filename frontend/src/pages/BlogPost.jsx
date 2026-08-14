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
      <article className="blog-post">
        <Link to="/blog" className="blog-back-link"><Icon icon="mdi:arrow-left" width={16} height={16} /> Back to Blog</Link>

        {!!post.tags?.length && (
          <div className="blog-card-tags" style={{ marginTop: 20 }}>
            {post.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        )}

        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-card-meta">
          <span>{post.author?.name || 'WeIntern Team'}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        {post.coverImageUrl && (
          <div className="blog-post-cover">
            <img src={post.coverImageUrl} alt={post.title} />
          </div>
        )}

        <div className="blog-post-content">
          {post.content.split('\n').map((para, i) => (para.trim() ? <p key={i}>{para}</p> : null))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
