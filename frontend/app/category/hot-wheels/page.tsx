import { redirect } from 'next/navigation'

export default function HotWheelsRedirect() {
  redirect('/explore?category=collectibles&subcategory=hot-wheels')
}
