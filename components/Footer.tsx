export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <p className="text-sm">
        Built by <span className="font-semibold">Akshaya Bandhanadham</span>
      </p>

      <div className="flex justify-center gap-4 mt-2 text-sm">
        <a
          href="https://github.com/akshayaabandhanadham"
          target="_blank"
          className="hover:underline"
        >
          GitHub
        </a>

        <a
          href="https://linkedin.com/in/akshayabandhanadham"
          target="_blank"
          className="hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}