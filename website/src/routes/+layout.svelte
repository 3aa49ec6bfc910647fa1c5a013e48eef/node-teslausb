<script>
	import '../app.css';
    const iconPath = '/favicon-16x16.png';
    const iconPathLg = '/favicon-32x32.png';
</script>

<svelte:head>
  <link rel="icon" type="image/svg" href={iconPath} />
</svelte:head>

<div class="inline-flex p-1" >
    <img src={iconPathLg} alt="icon" class="rounded"/>
    <h1 class="pl-2"><a href="/" class="text-black no-underline">node-teslausb</a></h1>
</div>


<slot />
