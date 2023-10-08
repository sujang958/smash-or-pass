import { existsSync } from "fs"
import { mkdir, writeFile } from "fs/promises"

const removeLast = (arr: any[]) => {
  const copied = structuredClone(arr)

  copied.pop()

  return copied
}

export const saveImage = async ({
  path,
  content,
}: {
  path: string
  content: Parameters<typeof writeFile>[1]
}) => {
  if (!existsSync(path))
    await mkdir(removeLast(path.split("/")).join("/"), { recursive: true })

  await writeFile(path, content)
}
