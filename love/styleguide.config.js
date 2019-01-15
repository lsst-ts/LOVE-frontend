module.exports = { 
    webpackConfig: require( './config/webpack.config.dev.js' ),
    theme: {
        color: {
          link: 'red',
          linkHover: 'salmon'
        },
        fontFamily: {
          base: '"Comic Sans MS", "Comic Sans", cursive'
        },
        fontSize: {
          base: 25
        }
      },
      styles: {

        Logo: {
          logo: {
            animation: 'blink ease-in-out 300ms infinite'
          },
          '@keyframes blink': {
            to: { opacity: 0 }
          }
        },
        StyleGuide:{
          '@global body':  {
            "--base-font-color": 'hsl(194, 16%, 79%)',
            "--base-font-color": "hsl(194, 16%, 79%)",
            "--secondary-font-color": "hsl(197, 13%, 59%)",
            "--secondary-font-dimmed-color": "hsl(197, 13%, 59%, 0.3)",
            "--tertiary-font-color": "hsl(201, 15%, 54%)",
          
            "--base-background-color": "hsl(205, 40%, 8%)",
            "--secondary-background-color": "hsl(198, 34%, 12%, 1)",
            "--secondary-background-dimmed-color": "hsl(198, 34%, 13.5%, 1)",
            "--tertiary-background-color": "hsl(201, 21%, 23%, 1)", 
            "--quaternary-background-color": "hsl(202, 32%, 28%)",
            "--quinary-background-color": "hsl(196, 16%, 28%)",
          
            /* Status */
            "--status-ok-color": "hsl(161, 100%, 32%)",
            "--status-ok-dimmed-color": "hsl(161, 100%, 32%, 0.2)",
            "--status-warning-color": "hsl(57, 100%, 47%)",
            "--status-warning-dimmed-color": "hsl(57, 100%, 47%, 0.2)",
            "--status-alert-color": "hsl(23, 99%, 44%)",
            "--status-alert-dimmed-color": "hsl(23, 99%, 44%, 0.2)",
          
          
            "--box-shadow-color": "rgba(0,0,0,0.17)",            
          },
          root:{
            "background-color":"hsl(205, 40%, 8%)"
          }
        }
      }
}
