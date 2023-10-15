<script lang="ts">
  import ky from "ky"

  let files: FileList
  let fileInput: HTMLInputElement

  const readFile = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.addEventListener("abort", () => reject("Aborted"))
      fileReader.addEventListener("error", () => reject("Errors"))

      fileReader.addEventListener("load", (event) => {
        resolve(fileReader.result?.toString()!)
      })

      fileReader.readAsDataURL(file)
    })

  let inputFiles: Array<Promise<string>> = []

  $: if (files?.length > 0) {
    inputFiles = []
    for (const file of files) inputFiles = [...inputFiles, readFile(file)]
  }

  const onSubmit = async (event: SubmitEvent) => {
    if (!(event.target instanceof HTMLFormElement)) return // show toast some shit

    const data = new FormData(event.target)

    // TODO: change to env
    const json = await ky.post("http://localhost:3000/v1/games/new", { body: data }).json()

    console.log(json)
  }
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
        <button
          type="button"
          on:click={() => fileInput.showPicker()}
          class="mt-2 rounded-lg px-4 py-1 bg-white text-black font-medium text-sm"
          >Select images</button
        >
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

      <!-- <p>Remember me</p> TODO: generate a safe password to modify later -->

      <button type="submit" class="rounded-lg px-4 py-1 bg-white text-black font-semibold mt-16"
        >Submit</button
      >
    </form>
    <section class="flex flex-col gap-y-8 w-1/2 py-56">
      {#each inputFiles as inputFile}
        {#await inputFile then src}
          <div>
            <img {src} alt="" class="object-contain rounded-lg" />
            <input type="text" />
          </div>
          <!-- TODO: add a button to remove with -->
        {/await}
      {/each}
      <!-- <p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p> -->
    </section>
  </div>
</div>
