import { Resource, Attachment } from "project-extender"
import {
  getDeleteUrl,
  getDownloadUrl,
  getThumbnailUrl,
  getUploadUrl,
} from "./helpFunctions"

export const getResource = (): Promise<Resource> =>
  fetch(`${import.meta.env.VITE_EXTENDER}/getResource`)
    .then((res) => res.json())
    .catch((err) => err)

export const getAttachmentThumbnail = (
  attachmentId: string,
  resource: Resource
): Promise<Blob> =>
  fetch(getThumbnailUrl(attachmentId, resource), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: resource.authorization,
    },
  }).then((data) => data.blob())

export const deleteAttachment = (
  attachmentId: string,
  resource: Resource
): Promise<void> =>
  fetch(getDeleteUrl(attachmentId, resource), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: resource.authorization,
    },
  }).then(() => {})

export const downloadAttachment = (
  attachemntId: string,
  resource: Resource
): Promise<Blob> =>
  fetch(getDownloadUrl(attachemntId, resource), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: resource.authorization,
    },
  }).then((data) => data.blob())

export const uploadAttachment = (
  issueIdOrKey: string,
  resource: Resource,
  form: FormData
): Promise<Attachment> =>
  fetch(getUploadUrl(issueIdOrKey, resource), {
    method: "POST",
    body: form,
    headers: {
      Accept: "application/json",
      Authorization: `${resource.authorization}`,
      "X-Atlassian-Token": "no-check",
    },
  }).then((att) => att.json())
