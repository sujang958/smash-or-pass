<script lang="ts">
  import ky from "ky"
  import toast from "svelte-french-toast"

  let files: FileList
  let fileInput: HTMLInputElement

  const readFile = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      if (!file.type.startsWith("image/")) return reject("Not an image file")

      fileReader.addEventListener("abort", () => reject("Aborted"))
      fileReader.addEventListener("error", () => reject("Errors"))

      fileReader.addEventListener("load", (event) => {
        resolve(fileReader.result?.toString()!)
      })

      fileReader.readAsDataURL(file)
    })

  let inputImages: Array<Promise<string>> = []

  $: try {
    if (files?.length > 0) for (const file of files) inputImages = [...inputImages, readFile(file)]
  } catch (e) {
    toast.error("Failed loading images")
  }

  const onSubmit = async (event: SubmitEvent) => {
    if (!(event.target instanceof HTMLFormElement)) return

    const data = new FormData(event.target)

    if (fileNames.length !== files.length) return toast.error("A name is required for an image")
    if (fileNames.filter((v) => !v).length > 0)
      return toast.error("A name is required for an image")

    for (const fileName of fileNames) data.append("imageNames", fileName)

    // TODO: change to env
    const json = await ky.post("http://localhost:3000/v1/games/new", { body: data }).json()

    console.log(json)
  }

  const fileNames: string[] = []
</script>

<div class="flex flex-col items-center">
  <div class="max-w-5xl w-full relative p-24 flex flex-row justify-between gap-x-36">
    <!-- For debugging, use bg-black -->
    <form
      class="flex flex-col gap-y-4 w-1/2 sticky top-24 h-min"
      on:submit|self|preventDefault={onSubmit}
    >
      <button type="button" class="mb-8"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 stroke-neutral-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
      </button>
      <section>
        <p class="text-4xl font-semibold">Create a new</p>
        <p class="mt-1 text-4xl font-semibold">Smash or Pass</p>
      </section>
      <div class="py-4" />
      <label class="flex flex-col">
        <p>Name</p>
        <input
          type="text"
          class="mt-2 rounded-lg bg-neutral-800 border border-neutral-700 px-2 py-1"
          placeholder="Name"
          maxlength="128"
          required
          name="name"
        />
      </label>
      <label class="flex flex-col">
        <p>Description</p>
        <textarea
          class="mt-2 rounded-lg bg-neutral-800 border border-neutral-700 px-2 py-1 w-full"
          placeholder="Description"
          maxlength="256"
          required
          name="description"
        />
      </label>
      <label class="relative">
        <p>Images</p>
        <div class="flex flex-row items-center mt-2 gap-x-2">
          <button
            type="button"
            on:click|preventDefault={() => fileInput.showPicker()}
            class="rounded-lg px-4 py-1 bg-white text-black font-medium text-sm"
            >Select images</button
          >
          {#if inputImages.length > 0}
            <button
              type="button"
              class="rounded-lg bg-red-700 px-4 py-1 text-sm font-medium"
              on:click|preventDefault|trusted={() => {
                fileInput.value = ""
                inputImages = []
              }}>Clear all</button
            >
          {/if}
        </div>
        <input
          type="file"
          name="files"
          multiple
          accept="image/*"
          bind:this={fileInput}
          bind:files
          class="opacity-0 top-8 left-0 absolute -z-10"
          required
        />
        <!-- invisible -->
      </label>

      <!-- <p>Remember me</p> let server generate TODO: generate a safe password to modify later -->
      <div class="border-b border-neutral-800 mt-8 mb-4" />
      <!-- <label class="text-base flex flex-row items-start gap-x-2 align-middle">
        <input
          type="checkbox"
          name="rememberMe"
          class="w-4 h-4 text-blue-600 rounded bg-neutral-700 border-gray-600 appearance-none mt-1"
        />
        <div>
          <p>Remeber me</p>
          <p class="text-xs text-neutral-400 mt-0.5">
            By checking this, a password will be generated for you. You can modify this
            smash-or-pass with the password after creating it.
          </p>
        </div>
      </label> -->
      <button
        type="submit"
        class="rounded-lg text-base px-4 py-1 bg-white text-black font-medium mt-2">Submit</button
      >
    </form>
    <section class="flex flex-col gap-y-8 w-1/2 py-56">
      {#each inputImages as inputFile, i}
        {#await inputFile then src}
          <div class="a{i} relative">
            <button
              type="button"
              class="absolute top-2 right-2 rounded-full p-0.5 backdrop-blur-md bg-black/50 transition duration-200 hover:scale-105"
              on:click={() => {
                fileInput.value = ""
                delete inputImages[i]
                inputImages = inputImages.filter((v) => v)
              }}
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img {src} alt="" class="object-contain rounded-lg w-full" />
            <div class="flex flex-row items-center justify-between mt-3">
              <p class="text-base font-medium">Name</p>
              <input
                type="text"
                bind:value={fileNames[i]}
                class="rounded-lg bg-neutral-800 border border-neutral-700 text-white px-2 py-0.5 text-sm"
                placeholder="Type here"
              />
            </div>
          </div>
          <!-- TODO: add a button to remove with -->
        {/await}
      {/each}
    </section>
  </div>
</div>
