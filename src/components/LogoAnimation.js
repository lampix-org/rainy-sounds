import anime from 'animejs';

export default class LogoAnimation {
  constructor() {
    const logo = document.getElementById('lampix-logo');
    logo.style.display = 'block';
    this.paths = Array.from(logo.getElementsByTagName('path'));
    this.paths.forEach((p) => {
      const length = p.getTotalLength();
      p.setAttribute('stroke-dasharray', length);
      p.setAttribute('stroke-dashoffset', length);
      p.setAttribute('stroke-width', 1.2);
      p.setAttribute('stroke-linecap', 'square');
      p.setAttribute('fill', p.getAttribute('stroke'));
      p.setAttribute('fill-opacity', 0);
      p.style.transition = 'fill-opacity 500ms ease 1s';
    });
    this.animate();
  }

  animate() {
    this.anim = anime({
      targets: 'path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 3000,
      delay: (el, i) => i * 250,
      autoplay: true,
      direction: 'alternate',
      loop: false,
      offset: 0,
      begin: () => {
        this.paths.forEach((p) => {
          const length = p.getTotalLength();
          p.setAttribute('stroke-dasharray', length);
          p.setAttribute('stroke-dashoffset', length);
        });
      },
      complete: () => {
        this.paths.forEach((p) => {
          p.setAttribute('fill-opacity', 1);
        });
        this.pause();
        setTimeout(() => {
          this.paths.forEach((p) => {
            p.setAttribute('fill-opacity', 0);
          });
        }, 5000);
        setTimeout(() => {
          this.restart();
        }, 6000);
      }
    });
  }

  pause() {
    this.anim.pause();
  }

  restart() {
    this.anim.restart();
  }
}
