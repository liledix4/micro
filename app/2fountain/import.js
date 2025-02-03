export async function imp(toObject, file, modulesArray) {
  await import(file).then(module => {
    modulesArray.forEach(mod => {
      toObject[mod] = module[mod];
    });
  });
}

/* 2DO v2
export async function imp(...arr) {
  let object = {};

  arr.forEach(fileArray => {
    const fileName = fileArray[0];
    import(fileName).then(module => {
      for (let i = 1; i < fileArray.length; i++) {
        const mod = fileArray[i];
        object[mod] = module[mod];
      }
    });
  });

  return object;
}
*/