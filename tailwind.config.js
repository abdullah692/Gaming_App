/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#CC00FF',
        'light-violet':'#4A3AFF',
        'content-blue':'#41445F',
        'dashboard-purple':'#CC00FF',
        'dashboard-yellow':'#F9B233',
        'dashboard-purple':'#CC00FF',
        'staking-yellow':'#FFC82C',
        
      },
      backgroundImage: {
        'sidebar-img': "url('/src/assets/images/sidebarimg1.png')",
        'cardImg': "url('/src/assets/images/maskgroup.png')",
        'cardImg2': "url('/src/assets/images/bg2.png')",
        'contentImg': "url('/src/assets/images/content_bg.png')",
        'sidebarSel': "url('/src/assets/images/sidebarSel.png')",
        'circlebg': "url('/src/assets/images/circlebg.png')",
        'liquiditymaskgroup': "url('/src/assets/images/liquiditymaskgroup.png')",
        'bg1': "url('/src/assets/images/bg1.png')",
        'modalbg': "url('/src/assets/images/Modalbg.png')",
        'stackbg': "url('/src/assets/images/stackbg.png')",
        'mobileContent': "url('/src/assets/images/mobileContent.png')",
        

        
      },
      
     
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require("@tailwindcss/forms")
  ]
}
