// export const Home: Component = () => {
//   return (
//     <div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//       <div>Home</div>
//     </div>
//   );
// };

export default function Home<Component>({number}) {
  return (
    <div>
      <div>Home {number}</div>
      <div>Home</div>
      <div>Home {number}</div>
      <div>Home</div>
      <div>Home</div>
      <div>Home</div>
      <div>Home</div>
      <div>Home</div>
    </div>
  );
}
