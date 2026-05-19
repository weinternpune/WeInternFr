export default {
  name: 'testimonial',
  title: 'Testimonials & Reviews',
  type: 'document',
  fields: [
    { name:'name',    title:'Student Name',  type:'string',  validation: R => R.required() },
    { name:'role',    title:'Role/Domain',   type:'string',  description:'e.g. Full Stack Developer' },
    { name:'college', title:'College',       type:'string' },
    { name:'rating',  title:'Rating (1-5)',  type:'number',  validation: R => R.required().min(1).max(5) },
    { name:'review',  title:'Review Text',   type:'text',    validation: R => R.required() },
    { name:'avatar',  title:'Avatar Image',  type:'image',   options:{ hotspot:true } },
    { name:'featured',title:'Featured',      type:'boolean', initialValue:false, description:'Show on homepage' },
  ],
  preview: { select: { title:'name', subtitle:'rating' } }
};
