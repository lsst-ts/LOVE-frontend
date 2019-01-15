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
          root:{
            "background-color":'gray'
          }
        }
      }
}
