const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const alumniDir = path.join(__dirname, "..", "public", "alumni", "2026")

const configs = [
  // Square sources
  { src: "ayushi sinha.jpeg", out: "ayushi-sinha.webp" },
  { src: "ganesh nayak.png", out: "ganesh-nayak.webp" },
  { src: "nimisha shrivastava.jpeg", out: "nimisha-shrivastava.webp" },
  { src: "prakritee sharma.png", out: "prakriti-sharma.webp" },
  { src: "prakriti shree.png", out: "prakriti-shree.webp" },
  { src: "priyanshu chaudhary.png", out: "priyanshu-chaudhary.webp" },
  { src: "rohit kumar.png", out: "rohit-kumar.webp" },
  { src: "samarth agarwal.jpeg", out: "samarth-agarwal.webp" },
  { src: "shilpa koley.png", out: "shilpa-koley.webp" },
  { src: "srishti mishra.png", out: "srishti-mishra.webp" },
  { src: "vyom singhal.png", out: "vyom-singhal.webp" },

  // Portrait sources with custom extract box
  {
    src: "atharv nerkar.jpg",
    out: "atharv-nerkar.webp",
    extract: { left: 0, top: 150, width: 2108, height: 2108 }
  },
  {
    src: "ayush sharma.jpg",
    out: "ayush-sharma.webp",
    extract: { left: 59, top: 0, width: 2399, height: 2399 }
  },
  {
    src: "dhruv singh bhadauria.jpg",
    out: "dhruv-singh-bhadauria.webp",
    extract: { left: 0, top: 0, width: 358, height: 358 }
  },
  {
    src: "Divy pareek.jpg",
    out: "divy-pareek.webp",
    extract: { left: 0, top: 100, width: 1944, height: 1944 }
  },
  {
    src: "Gautam kumar.jpg",
    out: "gautam-kumar.webp",
    extract: { left: 0, top: 0, width: 1123, height: 1123 }
  },
  {
    src: "manan verma.jpg",
    out: "manan-verma.webp",
    extract: { left: 0, top: 600, width: 3072, height: 3072 }
  },
  {
    src: "mridulupadhyay.jpg",
    out: "mridul-upadhyay.webp",
    extract: { left: 0, top: 290, width: 397, height: 397 }
  },
  {
    src: "pranjal jain.jpg",
    out: "pranjal-jain.webp",
    extract: { left: 0, top: 650, width: 2847, height: 2847 }
  },
  {
    src: "sarthak vyas.jpg",
    out: "sarthak-vyas.webp",
    extract: { left: 0, top: 600, width: 1944, height: 1944 }
  },
  {
    src: "shivam malviya.jpg",
    out: "shivam-malviya.webp",
    extract: { left: 0, top: 150, width: 3024, height: 3024 }
  },
  {
    src: "vemula.jpg",
    out: "vemula-tejamanideep.webp",
    extract: { left: 0, top: 0, width: 1334, height: 1334 }
  }
]

async function run() {
  console.log(`Processing ${configs.length} alumni images for 2026...`)
  for (const item of configs) {
    const srcPath = path.join(alumniDir, item.src)
    const outPath = path.join(alumniDir, item.out)
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${item.src}`)
      continue
    }

    let pipeline = sharp(srcPath).rotate()
    if (item.extract) {
      pipeline = pipeline.extract(item.extract)
    }
    await pipeline
      .resize(400, 400, { fit: "cover" })
      .webp({ quality: 80, effort: 6 })
      .toFile(outPath)

    const origKb = (fs.statSync(srcPath).size / 1024).toFixed(1)
    const newKb = (fs.statSync(outPath).size / 1024).toFixed(1)
    console.log(`✓ ${item.out.padEnd(28)} ${origKb}KB -> ${newKb}KB`)
  }
  console.log("Done!")
}

run().catch(console.error)
