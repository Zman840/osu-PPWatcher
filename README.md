<p align="center" style="font-size:40px">
  PP watcher
</p>

This program gives you the pp for the latest replay done after it's created. It will not update on the result screen, but after it. I'm pretty sure it doesn't work in multiplayer since replays don't get recorded there. Currently uses scorev2, though can use v1 in configs.

Some issues to find out:
- Unsubmitted unranked songs may have a large variance on whether or not it will be calculated. I probably need more data to figure out a better pattern to tackle it.
- When pp turns null, that usually means a directory path is not correct. That in itself could needs a better way of tackling it. Arguments for oppai shouldn't affect the way it runs.

---

### TODOS
- [ ] Clean up code better possibly
- [ ] Find any more errors / bugs on certain maps

---

### ESSENTIAL REQUIREMENTS
- NodeJS
- osu!StreamCompanion
- Osu! PP Advanced Inspector (https://github.com/Francesco149/oppai). See installation instructions for details using it.
- osrparse (https://github.com/kszlim/osu-replay-parser). See installation instructions for that. Uses python 3.4

---

### INSTRUCTIONS
1. Install both osrparse and Oppai with their instructions
2. Run osu!StreamCompanion (https://osu.ppy.sh/forum/t/209616)
3. under `map formatting`, make sure there's a filepath.txt file directing to the file location of the song in the format of `<your osu song folder>\!dir!\!OsuFileName!`. By default, Song.txt should be fine to use ![filepath.txt](http://i.imgur.com/8GxWj7p.png)
4. Copy configs to `config.json` and point all folders to the right path.
5. Run `node index` to leave it on standby

if all goes well, there will be no errors running.
