export interface File {
  uuid: string;
  device: string;
  filename: string;
  content: string;
  parent_dir_uuid: string;
  is_directory: boolean;
}
