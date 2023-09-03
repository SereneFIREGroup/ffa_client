import { defHttp } from "@/utils/http/axios";
import { FamilyModel } from "@/api/sys/model/familyModel";

enum Api {
  FamilyInfo = "/family/${familyID}/info",
}

export function getFamilyInfo(familyID: string, userID: string, token: string) {
  const url = Api.FamilyInfo.replace("${familyID}", familyID);
  return defHttp.get<FamilyModel>(
    {
      url: url,
      headers: {
        "X-User-ID": userID,
        "X-Token": token,
      },
    },
    { errorMessageMode: "none" }
  );
}
