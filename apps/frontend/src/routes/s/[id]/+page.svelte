<script lang="ts">
  import { onMount } from "svelte"
  import gsap from "gsap"

  let smashVideo: HTMLVideoElement
  let passVideo: HTMLVideoElement
  let effectShown = false

  const onChoose = (smash: boolean) => {
    const video = smash ? smashVideo : passVideo

    effectShown = true

    video.classList.remove("hidden")

    gsap.to(video, { scale: 1.2 })

    video.currentTime = 0
    video.muted = false
    video.play()

    video.addEventListener("ended", () => {
      setTimeout(() => {
        gsap.to(video, { scale: 1 })
        video.classList.add("hidden")
        effectShown = false
      }, 50)
    })
  }
</script>

<div class="flex flex-col items-center overflow-hidden">
  <div class="h-screen max-w-5xl w-full flex flex-col items-center justify-center p-24 space-y-20">
    <section class="text-center -mt-2">
      <p class="text-5xl font-bold">128 Anime Girls</p>
      <p class="mt-3 text-base text-neutral-400">Your 2D anime waifus</p>
    </section>
    <section class="w-2/3 flex flex-col">
      <div class="">
        <p class="text-lg font-medium">Arima Kana</p>
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b9024d9f-7d55-4c89-ad2b-427fe84340cd/dfwiggd-bfc09966-edfc-490d-8352-e7d3f4f7f853.jpg/v1/fill/w_1192,h_670,q_70,strp/kana_arima_by_nkbhd_dfwiggd-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDMyMCIsInBhdGgiOiJcL2ZcL2I5MDI0ZDlmLTdkNTUtNGM4OS1hZDJiLTQyN2ZlODQzNDBjZFwvZGZ3aWdnZC1iZmMwOTk2Ni1lZGZjLTQ5MGQtODM1Mi1lN2QzZjRmN2Y4NTMuanBnIiwid2lkdGgiOiI8PTc2ODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.g_mQ3yhXcO8El9hzNDjW86E6lX1InWIGatXE3M8LZRc"
          alt="Arima Kana"
          class="object-contain w-full rounded-lg mt-2"
          draggable="false"
        />
      </div>
      <p class="text-sm self-end text-neutral-400 mt-2">1/128</p>
    </section>
    <section class="flex flex-row items-center justify-center gap-x-6">
      <button
        type="button"
        class="bg-white text-black rounded-lg font-semibold px-7 py-1.5 text-lg transition duration-200 hover:scale-110"
        on:click={() => onChoose(true)}>Smash</button
      >
      <button
        type="button"
        class="bg-neutral-800 border border-neutral-700 rounded-lg font-medium px-7 py-1.5 text-lg transition duration-200 hover:scale-110"
        on:click={() => onChoose(false)}>Pass</button
      >
    </section>
  </div>
</div>
<!-- TODO: add squoosh to handle uploaded images on client and deny the images over 4 mb -->

<div
  class="fixed inset-0 h-screen bg-black/50 flex flex-col items-center justify-center p-24 backdrop-blur {effectShown
    ? 'block'
    : 'hidden'}"
>
  <video src="/videos/smash.mp4" class="rounded-lg hidden" controls={false} bind:this={smashVideo}>
    <track kind="captions" />
  </video>
  <video src="/videos/pass.mp4" class="rounded-lg hidden" controls={false} bind:this={passVideo}>
    <track kind="captions" />
  </video>
</div>
