import sys
import json

def main():
    url = sys.argv[1]

    white_list_file=open('/Users/benstewart/BEN STUFF/PROJECTS/fyp/code/phish detector/whitelist.txt', "a+")
    white_list_file.write(url)
    white_list_file.write("\n")
    white_list_file.close()
    print("Whitelist Updated")

if __name__ == "__main__":
    main()
