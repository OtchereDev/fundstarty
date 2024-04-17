export default function Label({ text, htmlFor = '' }: { text: string; htmlFor?: string }) {
  return (
    <label className="mb-1 inline-block text-lg" htmlFor={htmlFor}>
      {text}
    </label>
  )
}
