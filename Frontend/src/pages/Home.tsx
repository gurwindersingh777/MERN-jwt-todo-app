import Todo from "../components/Todo";
import UserMenu from "../components/UserMenu";

export default function Home() {
  return (
    <div className="p-15 relative">
      <Todo />
      <UserMenu />
    </div>
  )
}
