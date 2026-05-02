export const success = (data: any) =>
  Response.json({ success: true, data });

export const error = (msg: string, status = 400) =>
  Response.json({ success: false, error: msg }, { status });