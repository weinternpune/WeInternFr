import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

export default defineConfig({
  name: 'weintern',
  title: 'WeIntern CMS',
  projectId: 'v2bijm6q',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      {
        name:'hero', title:'Hero Section', type:'document',
        fields:[
          {name:'badge', title:'Badge Text', type:'string'},
          {name:'heading', title:'Main Heading', type:'string'},
          {name:'highlightText', title:'Highlight Text (gold)', type:'string'},
          {name:'subheading', title:'Subheading', type:'text'},
          {name:'stat1Value', title:'Stat 1 Value', type:'string'},
          {name:'stat1Label', title:'Stat 1 Label', type:'string'},
          {name:'stat2Value', title:'Stat 2 Value', type:'string'},
          {name:'stat2Label', title:'Stat 2 Label', type:'string'},
          {name:'stat3Value', title:'Stat 3 Value', type:'string'},
          {name:'stat3Label', title:'Stat 3 Label', type:'string'},
          {name:'fearQuote', title:'Fear Quote', type:'string'},
          {name:'fearResolve', title:'Fear Resolution', type:'string'},
          {name:'primaryBtnText', title:'Primary Button', type:'string'},
          {name:'secondaryBtnText', title:'Secondary Button', type:'string'},
        ]
      },
      {
        name:'course', title:'Courses', type:'document',
        fields:[
          {name:'title', title:'Course Title', type:'string', validation:R=>R.required()},
          {name:'emoji', title:'Emoji', type:'string'},
          {name:'description', title:'Short Description', type:'text'},
          {name:'tagline', title:'Tagline', type:'string'},
          {name:'about', title:'Full Description', type:'text'},
          {name:'price', title:'Price (Rs.)', type:'number'},
          {name:'duration', title:'Duration', type:'string'},
          {name:'level', title:'Level', type:'string', options:{list:['beginner','intermediate','advanced'],layout:'radio'}},
          {name:'tools', title:'Tools (comma separated)', type:'string'},
          {name:'language', title:'Language', type:'string', initialValue:'English + Hindi'},
          {name:'colorH1', title:'Card Color From (hex)', type:'string'},
          {name:'colorH2', title:'Card Color To (hex)', type:'string'},
          {name:'active', title:'Active', type:'boolean', initialValue:true},
          {name:'order', title:'Display Order', type:'number'},
        ],
        preview:{select:{title:'title',subtitle:'duration'}}
      },
      {
        name:'testimonial', title:'Testimonials', type:'document',
        fields:[
          {name:'name', title:'Student Name', type:'string', validation:R=>R.required()},
          {name:'role', title:'Role/Domain', type:'string'},
          {name:'college', title:'College', type:'string'},
          {name:'rating', title:'Rating (1-5)', type:'number'},
          {name:'review', title:'Review Text', type:'text', validation:R=>R.required()},
          {name:'featured', title:'Featured on Homepage', type:'boolean', initialValue:false},
        ],
        preview:{select:{title:'name',subtitle:'rating'}}
      },
      {
        name:'seo', title:'SEO Settings', type:'document',
        fields:[
          {name:'siteTitle', title:'Site Title', type:'string'},
          {name:'siteDescription', title:'Meta Description', type:'text'},
          {name:'keywords', title:'Keywords', type:'string'},
          {name:'ogTitle', title:'OG Title', type:'string'},
          {name:'ogDescription', title:'OG Description', type:'text'},
        ]
      },
    ]
  },
})
