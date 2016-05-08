#!python3
import sys
from osrparse import parse_replay_file
from decimal import *

#returns instance of Replay
# fileLocation = "Z:\\Program Files (x86)\\osu!\\Data\\r\\63ad71780c93c267b696caf9e1e8a38c-131070592227256434.osr"
# print (str(sys.argv))
fileLocation = sys.argv[1]
file = parse_replay_file(fileLocation)

mods = ""
if (len(file.mod_combination) > 0):
    mods +='+'
for i in file.mod_combination:
    i = str(i)
    if i == 'Mod.NoMod':
        mods = '+nomod'
        break
    if i == 'Mod.NoFail':
        mods += 'nf'
    if i == 'Mod.Easy':
        mods += 'ez'
    if i == 'Mod.Hidden':
        mods += 'hd'
    if i == 'Mod.HardRock':
        mods += 'hr'
    if i == 'Mod.DoubleTime':
        mods += 'dt'
    if i == 'Mod.Nightcore':
        mods += 'nc'
    if i == 'Mod.Flashlight':
        mods += 'fl'
    if i == 'Mod.SpunOut':
        mods += 'so'

accuracy = Decimal((file.number_300s * 6 + file.number_100s * 2 + file.number_50s) / ((file.number_300s + file.number_100s + file.number_50s + file.misses) * 6) * 100).quantize(Decimal('1.00'))
print ("fileLocation: " + fileLocation)
print ("accuracy: " + str(accuracy) + '%')
print ("mods: " + mods)
print ("total: " + str(file.max_combo) + "x")
print ("misses: " + str(file.misses) + "m")
