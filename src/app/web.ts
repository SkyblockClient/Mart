export const recursivelyGet = async (
  base: FileSystemDirectoryHandle,
  parts: string[],
  create: boolean,
): Promise<FileSystemDirectoryHandle> => {
  if (parts.length == 0) return base;
  return await recursivelyGet(
    await base.getDirectoryHandle(parts[0], { create }),
    parts.slice(1),
    create,
  );
};
