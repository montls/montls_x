import sys
import json

file1 = open(sys.argv[1],'r')

tmp = {}
i = 0
for line in file1:
    s = line.split()
    tmp[i] = s
    i += 1

file2 = open('./data.json','w')
file2.write(json.dumps(tmp))
