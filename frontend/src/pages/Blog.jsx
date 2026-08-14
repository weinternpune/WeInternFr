import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Layout/Navbar';
import { getBlogPosts } from '../utils/api';
import './Blog.css';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBlogPosts();
        setPosts(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="blog-page">
      <Navbar />
      <div className="blog-hero">
        <span className="blog-eyebrow">— From the WeIntern Team —</span>
        <h1>WeIntern Blog</h1>
        <p>Updates, guides, and stories from our student and mentor community.</p>
      </div>

      <div className="blog-body">
        {loading && (
          <div className="blog-empty">
            <Icon icon="mdi:loading" width={28} height={28} className="blog-spin" />
            <p>Loading posts…</p>
          </div>
        )}

        {!loading && error && (
          <div className="blog-empty">
            <Icon icon="mdi:alert-circle-outline" width={28} height={28} />
            <p>Couldn't load blog posts right now. Please try again shortly.</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="blog-empty">
            <Icon icon="mdi:notebook-outline" width={28} height={28} />
            <p>No posts yet — check back soon!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post._id}>
                <div className="blog-card-cover">
                  {post.coverImageUrl ? (
                    <img src={post.coverImageUrl} alt={post.title} />
                  ) : (
                    <div className="blog-card-cover-fallback">
                      <Icon icon="mdi:file-document-outline" width={32} height={32} />
                    </div>
                  )}
                </div>
                <div className="blog-card-body">
                  {!!post.tags?.length && (
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 2).map((t) => <span key={t}>{t}</span>)}
                    </div>
                  )}
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <span>{post.author?.name || 'WeIntern Team'}</span>
                    <span>·</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
