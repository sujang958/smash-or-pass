<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';

	let files: FileList;
	let fileInput: HTMLInputElement;

	$: console.log(files);
</script>

<!-- <div class="flex flex-col items-center">
	<div class="max-w-5xl w-full p-24 relative min-h-screen">
		<section>
			<p class="text-4xl font-semibold">Create a</p>
			<p class="mt-1 text-4xl font-semibold">New Smash or Pass</p>
		</section>
		<div class="py-24 flex flex-row justify-between gap-x-32">
			<section class="flex flex-col gap-y-4 w-1/2">
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
				<label>
					<p>Images</p>
					<button
						on:click={() => fileInput.showPicker()}
						class="mt-2 rounded-lg px-4 py-1 bg-white text-black font-medium text-sm"
						>Select images</button
					>
				</label>

				<button type="submit" class="rounded-lg px-4 py-1 bg-white text-black font-medium mt-14"
					>Submit</button
				>
			</section>
			<section class="flex flex-col gap-y-4 w-1/2">
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
				<p class="text-5xl h-64">asdf</p>
			</section>
		</div>
	</div>
</div> -->

<div class="flex flex-col items-center">
	<div class="max-w-5xl w-full relative p-24 flex flex-row justify-between gap-x-36">
		<!-- For debugging, use bg-black -->
		<form class="flex flex-col gap-y-4 w-1/2 sticky top-24 h-min">
			<button type="button"
			class="mb-8"
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
			<label>
				<p>Images</p>
				<button
					on:click={() => fileInput.showPicker()}
					class="mt-2 rounded-lg px-4 py-1 bg-white text-black font-medium text-sm"
					>Select images</button
				>
			</label>

			<button type="submit" class="rounded-lg px-4 py-1 bg-white text-black font-semibold mt-16"
				>Submit</button
			>
		</form>
		<section class="flex flex-col gap-y-4 w-1/2 py-56">
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
			<p class="text-5xl h-64">asdf</p>
		</section>
	</div>
</div>

<input
	type="file"
	name="files"
	multiple
	accept="image/*"
	bind:this={fileInput}
	bind:files
	class="invisible"
	required
/>
