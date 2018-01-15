window.onload = ( function ( ) {
  // global variables
  const canvas = document.getElementById( 'can' );
  const ctx = canvas.getContext( '2d' );
  const wrapper = document.getElementById( 'wrapper' );
  const num1 = document.querySelector( 'span:first-child' );
  const num2 = document.querySelector( 'span:nth-child(3)' );
  const sum = document.getElementById( 'sum' );
  const inputWriter = document.createElement( 'input' );
  const sprite = new Image( );
  // 38px шаг между точками рисования дуг, 23 шага всего
  const step = Math.floor( 38.04347826086957 );
  class Renderer {
      constructor( ) {
          this.values = [ ];
          this.xStart = 35;
          this.yStart = 98;
          this.yEnd = 95;
          this.yCtrl = ( step * num1.textContent ) / 23;
      }
      calculateAxis( val ) {
          if ( val === num2.textContent ) {
              let xStart = this.xEnd;
              // let xStart = this.xEnd;
              let yStart = this.yEnd;
              let xEnd = xStart + ( step * val ) + ( val * 1 );
              let xCtrl = ( xStart * 0.5 ) + ( xEnd * 0.5 );
              this.xEnd = xEnd;
              this.xCtrl = xCtrl;
              return {
                  xStart, yStart, xEnd, xCtrl
              };
          }
          this.yCtrl = this.yEnd / val;
          let xStart = this.xStart;
          let yStart = this.yStart;
          let xEnd = step + ( step * val ) + ( val * 1 );
          let xCtrl = ( xStart * 0.5 ) + ( xEnd * 0.5 );
          this.xEnd = xEnd;
          this.xCtrl = xCtrl;
          return {
              xEnd, xCtrl
          };
      }
      render( numValue ) {
          if ( renderer.values.length === 2 ) {
              const inputSum = document.createElement( 'input' );
              inputSum.classList.add( 'inputSum' );
              document.querySelector( '.math' ).appendChild( inputSum );
              inputSum.focus( );
              inputSum.oninput = checkSum;
              document.getElementById( 'sum' ).nextElementSibling.remove( );
              return;
          }
          const {
              xStart, yStart, xEnd, xCtrl, yCtrl
          } = this.calculateAxis( numValue );
          inputWriter.style.top = this.yCtrl + step + 'px';
          inputWriter.style.left = xCtrl - ( step / 2 ) + 'px';
          wrapper.insertBefore( inputWriter, canvas );
          inputWriter.value = '';
          inputWriter.focus( );
          if ( numValue === num2.textContent ) {
              drawAxis( xStart, yStart, xCtrl, this.yCtrl, xEnd, this.yEnd, numValue );
              return;
          }
          drawAxis( this.xStart, this.yStart, xCtrl, this.yCtrl, xEnd, this.yEnd, numValue );
      }
  }
  const renderer = new Renderer( );

  function init( ) {
      inputWriter.addEventListener( 'input', inputHandler );
      inputWriter.classList.add( 'aboveCanvasItem' );
      sprite.src = "sprite.png";
      sprite.onload = function ( ) {
          ctx.drawImage( sprite, 0, 100, canvas.width, sprite.height );
      }
      num1.textContent = randNum( 5, 9 );
      num2.textContent = randNum( 1, 4 );
      renderer.render( num1.textContent );
  }
  init( );

  function inputHandler( e ) {
          const inpVal = e.target.value;
          const result = checkInput( inpVal );
          if ( result ) {
              renderer.values.push( inpVal );
              const inputReplacer = document.createElement( 'span' );
              num1.style.backgroundColor = 'transparent';
              inputWriter.classList.remove( 'wrong' );
              inputWriter.remove( );
              if ( renderer.values === 2 ) {
                  const inputReplacer = document.createElement( 'span' );
                  inputReplacer.style.top = renderer.yCtrl + step + 'px';
                  inputReplacer.style.left = renderer.xCtrl - ( step / 2 ) + 'px';
                  inputReplacer.classList.add( 'aboveCanvasItem' );
                  inputReplacer.style.border = 'none';
                  document.querySelector( 'span' ).textContent = inpVal;
              }
              inputReplacer.style.top = renderer.yCtrl + step + 'px';
              inputReplacer.style.left = renderer.xCtrl - ( step / 2 ) + 'px';
              inputReplacer.classList.add( 'aboveCanvasItem' );
              inputReplacer.style.border = 'none';
              inputReplacer.textContent = inpVal;
              wrapper.insertBefore( inputReplacer, canvas );
              renderer.render( num2.textContent );
          } else {
              num1.style.backgroundColor = 'yellow';
              inputWriter.focus( );
              inputWriter.classList.add( 'wrong' );
          }
      }
      // helper functions
  function checkSum( e ) {
      if ( +( e.target.value ) === ( parseInt( renderer.values[ 0 ] ) + parseInt( renderer.values[ 1 ] ) ) ) {
          document.querySelector( '.inputSum' ).remove( );
          const span = document.createElement( 'span' );
          span.textContent = e.target.value;
          document.querySelector( '.math' ).appendChild( span );
          inputWriter.removeEventListener('input', inputHandler);
          return;
      }
  }

  function checkInput( value ) {
      if ( value === num1.textContent || value === num2.textContent ) {
          return true;
      }
      return false;
  }

  function randNum( min, max ) {
      let randVal = min + Math.random( ) * ( max + 1 - min );
      randVal = Math.floor( randVal );
      return randVal;
  }

  function drawAxis( x0, y0, x1, y1, x2, y2 ) {
      const arrowWidth = 8;
      const arrowAngle = Math.atan2( x1 - x2, y1 - y2 ) + Math.PI;
      ctx.beginPath( );
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.lineCap = 'round';
      ctx.moveTo( x0, y0 );
      ctx.quadraticCurveTo( x1, y1, x2, y2 );
      ctx.moveTo( x2 - ( arrowWidth * Math.sin( arrowAngle - Math.PI / 6 ) ), y2 - ( arrowWidth * Math.cos( arrowAngle - Math.PI / 6 ) ) );
      ctx.lineTo( x2, y2 );
      ctx.lineTo( x2 - ( arrowWidth * Math.sin( arrowAngle + Math.PI / 6 ) ), y2 - ( arrowWidth * Math.cos( arrowAngle + Math.PI / 6 ) ) );
      ctx.stroke( );
      ctx.closePath( );
  }
} )( );