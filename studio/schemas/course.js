export default {
  name: 'course',
  title: 'Courses',
  type: 'document',
  fields: [
    { name:'title',       title:'Course Title',   type:'string',  validation: R => R.required() },
    { name:'emoji',       title:'Emoji',          type:'string',  description:'e.g. 🌐' },
    { name:'description', title:'Short Description', type:'text', description:'Shown on course card' },
    { name:'tagline',     title:'Tagline',        type:'string' },
    { name:'about',       title:'Full Description', type:'text',  description:'Shown in course detail page' },
    { name:'price',       title:'Price (Rs.)',     type:'number', validation: R => R.required().min(0) },
    { name:'duration',    title:'Duration',        type:'string', description:'e.g. 12 Weeks' },
    { name:'level',       title:'Level',           type:'string',
      options: { list: ['beginner','intermediate','advanced'], layout:'radio' } },
    { name:'tools',       title:'Tools (comma separated)', type:'string', description:'e.g. React, Node.js, MongoDB' },
    { name:'language',    title:'Language',        type:'string', initialValue:'English + Hindi' },
    { name:'colorH1',     title:'Card Color 1',    type:'string', description:'Hex color e.g. #e76f51' },
    { name:'colorH2',     title:'Card Color 2',    type:'string', description:'Hex color e.g. #f4a261' },
    { name:'active',      title:'Active (visible to students)', type:'boolean', initialValue:true },
    { name:'order',       title:'Display Order',   type:'number', description:'Lower number = shown first' },
    {
      name:'curriculum',
      title:'Curriculum',
      type:'array',
      of:[{ type:'object', fields:[
        { name:'week',   title:'Week/Phase', type:'string' },
        { name:'title',  title:'Title',      type:'string' },
        { name:'topics', title:'Topics (comma separated)', type:'string' },
      ]}]
    },
    {
      name:'projects',
      title:'Projects',
      type:'array',
      of:[{ type:'object', fields:[
        { name:'name', title:'Project Name', type:'string' },
        { name:'tech', title:'Tech Stack',   type:'string' },
      ]}]
    },
    {
      name:'faqs',
      title:'FAQs',
      type:'array',
      of:[{ type:'object', fields:[
        { name:'question', title:'Question', type:'string' },
        { name:'answer',   title:'Answer',   type:'text' },
      ]}]
    },
  ],
  preview: { select: { title:'title', subtitle:'duration' } }
};
