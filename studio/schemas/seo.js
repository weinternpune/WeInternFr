export default {
  name: 'seo',
  title: 'SEO Settings',
  type: 'document',
  fields: [
    { name:'siteTitle',       title:'Site Title',        type:'string' },
    { name:'siteDescription', title:'Meta Description',  type:'text',   description:'150-160 characters for Google' },
    { name:'keywords',        title:'Keywords',          type:'string', description:'comma separated keywords' },
    { name:'ogTitle',         title:'OG Title',          type:'string', description:'Social share title' },
    { name:'ogDescription',   title:'OG Description',    type:'text',   description:'Social share description' },
  ],
  preview: { select: { title:'siteTitle' } }
};
