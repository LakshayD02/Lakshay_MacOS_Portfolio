interface VSCodeProps {
  isDarkMode?: boolean
}

// Replace VSCode component with an iframe
export default function VSCode({ isDarkMode = true }: VSCodeProps) {
  return (
    <div className="h-full w-full bg-gray-900">
      <iframe
        src="https://github1s.com/LakshayD02/Lakshay_MacOS_Portfolio/edit/main/README.md"
        className="w-full h-full border-0"
        title="VSCode Project View"
      />
    </div>
  )
}
