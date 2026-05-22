export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    { name:'badge',          title:'Badge Text',        type:'string', description:'e.g. A New Era of Learning' },
    { name:'heading',        title:'Main Heading',      type:'string', description:'e.g. Students Don\'t Wait for Opportunity.' },
    { name:'highlightText',  title:'Highlight Text',    type:'string', description:'e.g. They Build It.' },
    { name:'subheading',     title:'Subheading',        type:'text',   description:'The paragraph below the heading' },
    { name:'stat1Value',     title:'Stat 1 Value',      type:'string', description:'e.g. 500' },
    { name:'stat1Label',     title:'Stat 1 Label',      type:'string', description:'e.g. Students Placed' },
    { name:'stat2Value',     title:'Stat 2 Value',      type:'string', description:'e.g. 120' },
    { name:'stat2Label',     title:'Stat 2 Label',      type:'string', description:'e.g. Live Projects' },
    { name:'stat3Value',     title:'Stat 3 Value',      type:'string', description:'e.g. 98' },
    { name:'stat3Label',     title:'Stat 3 Label',      type:'string', description:'e.g. Satisfaction Rate' },
    { name:'fearHeading',    title:'Fear Box Heading',  type:'string', description:'e.g. EVERY STUDENT FEARS:' },
    { name:'fearQuote',      title:'Fear Quote',        type:'string', description:'e.g. Nobody gives freshers a chance.' },
    { name:'fearResolve',    title:'Fear Resolution',   type:'string', description:'e.g. At WeIntern, you\'re already working in the industry.' },
    { name:'primaryBtnText',   title:'Primary Button Text',   type:'string', description:'e.g. Join as Intern' },
    { name:'secondaryBtnText', title:'Secondary Button Text', type:'string', description:'e.g. Hire a Team' },
  ],
  preview: { select: { title: 'heading' } }
};
