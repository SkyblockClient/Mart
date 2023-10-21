<script lang="ts">
  import { os } from "@neutralinojs/lib";

  let username: string | undefined;
  const loadUsername = async () => {
    const key = NL_OS == "Windows" ? "USERNAME" : "USER";
    try {
      username = await os.getEnv(key);
    } catch (err) {
      console.error(err);
    }
  };
  loadUsername();
</script>

<h1>{username}</h1>
hes him fr
