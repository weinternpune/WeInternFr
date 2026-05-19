import { useState, useEffect } from 'react';
import { client, QUERIES } from '../utils/sanityClient';

export const useSanityHero = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!client) return;
    setLoading(true);
    client.fetch(QUERIES.hero)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
};

export const useSanityCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!client) return;
    setLoading(true);
    client.fetch(QUERIES.courses)
      .then(data => { if (data?.length) setCourses(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { courses, loading };
};

export const useSanityTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!client) return;
    setLoading(true);
    client.fetch(QUERIES.testimonials)
      .then(data => { if (data) setTestimonials(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { testimonials, loading };
};

export const useSanitySEO = () => {
  const [seo, setSeo] = useState(null);
  useEffect(() => {
    if (!client) return;
    client.fetch(QUERIES.seo).then(setSeo).catch(() => {});
  }, []);
  return { seo };
};
