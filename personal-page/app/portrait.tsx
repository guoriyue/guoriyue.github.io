import { rotatePortrait } from './portrait-rotation';

const photos = [
  { src: '/portrait.jpg', position: '50% 50%' },
  { src: '/portraits/x-2073991697978266100.jpg', position: '82% 45%' },
  { src: '/portraits/nvidia-headshot.webp?v=ai-hd', position: '50% 50%' },
  { src: '/portraits/x-2028395242450501674.jpg', position: '50% 25%' },
  { src: '/portraits/x-2074018741755802017.jpg', position: '50% 85%' },
  { src: '/portraits/x-1978703247226331443.jpg', position: '50% 30%' },
];

export default function Portrait() {
  return (
    <>
      <img
        id="portrait"
        className="portrait"
        src={photos[0].src}
        alt="Mingfei Guo"
        width="240"
        height="240"
        fetchPriority="high"
        style={{ objectPosition: photos[0].position }}
        suppressHydrationWarning
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(${rotatePortrait.toString()})(${JSON.stringify(photos)});`,
        }}
      />
    </>
  );
}
