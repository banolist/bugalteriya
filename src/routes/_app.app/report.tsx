import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/app/report')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/app/report"!</div>
}
