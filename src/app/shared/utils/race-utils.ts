const trackSvgMap: {[country: string]: string} = {
  Spain: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.38 37.54">
    <style>
      .cls-1 {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-miterlimit: 10;
        stroke-width: 3px;
      }
    </style>
    <g id="spain">
      <path class="cls-1" d="M43.58,126.78h0a7.49,7.49,0,0,0-3.38-4.16l-4.11-2.37a8.94,8.94,0,0,1-4.47-7.74h0a10.94,10.94,0,0,1,10.94-10.94h20a3,3,0,0,1,2.76,4.29l-0.72,1.58a9.91,9.91,0,0,1-9,5.8H45.43a1.49,1.49,0,0,0-1,2.6l9.71,8.51a9.2,9.2,0,0,0,6.06,2.28h7.53a4,4,0,0,0,3.95-3.95v-2.07a7.33,7.33,0,0,1,1.41-4.33L81.34,105a3.82,3.82,0,0,1,5-1.05l33.78,19.5a1.59,1.59,0,0,0,2.36-1.66l-0.59-3.2a9.45,9.45,0,0,0-5.64-7h0a4.56,4.56,0,0,1-2.57-5.62h0a4.56,4.56,0,0,1,5.83-2.89l9,3.14a5,5,0,0,1,3.36,4.73v5.59a3.61,3.61,0,0,0,1.06,2.55h0a3.61,3.61,0,0,1,1.06,2.55v4.29a6,6,0,0,1-6,6H50.7A7.49,7.49,0,0,1,43.58,126.78Z" transform="translate(-30.12 -100.06)"/>
      <line class="cls-1" x1="73.2" y1="27.68" x2="73.2" y2="36.04"/>
    </g>
  </svg>
    `, 
}

export function getTrackSvg(country: string): string | null {
  return trackSvgMap[country] ?? null;
}