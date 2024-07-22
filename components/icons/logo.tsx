const { STORE_PREFIX } = process.env;

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logo/${STORE_PREFIX}/logo-icon.svg`} alt="logo" {...props} />;
}
