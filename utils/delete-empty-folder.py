import os

def remove_empty_folders(path):
    """
    Recursively goes through directories starting from the given path,
    checks if they are empty, and removes them if they are.
    
    :param path: The path to the root folder containing subfolders.
    """
    # List to hold directories to be removed
    dirs_to_remove = []

    # Walk through all directories and files in the given path
    for dirpath, dirs, files in os.walk(path, topdown=False):
        # Check if the current directory is empty
        if not os.listdir(dirpath):
            # print(f"Removing empty folder: {dirpath}")
            
            dirpath = dirpath.replace('\\', '/')
            
            # Add the directory to the list of directories to be removed
            dirs_to_remove.append(dirpath)

    print(len(dirs_to_remove))
    # Remove the directories marked for deletion
    for dirpath in dirs_to_remove:
        # dirpath = os.path.join(os.path.dirname(dirpath), dirname)
        # dirpath = dirpath.replace('\\', '/')
        print(dirpath)
        if os.path.exists(dirpath):
            os.rmdir(dirpath)
            print(f"Removing empty folder: {dirpath}")
            


# Example usage
root_folder_path = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/data/products/images'
remove_empty_folders(root_folder_path)
