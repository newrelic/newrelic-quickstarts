package se.cloudenablers.demo.microprofile.todo;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represent the MP Auth token
 */

public class MPJWTToken {

    private String iss; // issuer
    private String aud; // audience
    private String jti; // Unique identifier
    private Long exp; // expiration time
    private Long iat; // issued at
    private String sub; // subject
    private String upn; // value for name in Principal
    private String preferredUsername;  // value for name in Principal
    private List<String> groups = new ArrayList<>();
        /*
    "iss": "https://server.example.com",
            "aud": "s6BhdRkqt3",
            "jti": "a-123",
            "exp": 1311281970,
            "iat": 1311280970,
            "sub": "24400320",
            "upn": "jdoe@server.example.com",
            "groups": ["red-group", "green-group", "admin-group", "admin"],
    */

    private List<String> roles;
    private Map<String, String> additionalClaims;

    public String getIss() {
        return iss;
    }

    public void setIss(String iss) {
        this.iss = iss;
    }

    public String getAud() {
        return aud;
    }

    public void setAud(String aud) {
        this.aud = aud;
    }

    public String getJti() {
        return jti;
    }

    public void setJti(String jti) {
        this.jti = jti;
    }

    public Long getExp() {
        return exp;
    }

    public void setExp(Long exp) {
        this.exp = exp;
    }

    public Long getIat() {
        return iat;
    }

    public void setIat(Long iat) {
        this.iat = iat;
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getUpn() {
        return upn;
    }

    public void setUpn(String upn) {
        this.upn = upn;
    }

    public String getPreferredUsername() {
        return preferredUsername;
    }

    public void setPreferredUsername(String preferredUsername) {
        this.preferredUsername = preferredUsername;
    }

    public List<String> getGroups() {
        return groups;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Map<String, String> getAdditionalClaims() {
        return additionalClaims;
    }

    public void setAdditionalClaims(Map<String, String> additionalClaims) {
        this.additionalClaims = additionalClaims;
    }

    public void addAdditionalClaims(String key, String value) {
        if (additionalClaims == null) {
            additionalClaims = new HashMap<>();
        }
        additionalClaims.put(key, value);
    }

    public String toJSONString() {

        JSONObject jsonObject = new JSONObject();
        jsonObject.appendField("iss", iss);
        jsonObject.appendField("aud", aud);
        jsonObject.appendField("jti", jti);
        jsonObject.appendField("exp", exp / 1000);
        jsonObject.appendField("iat", iat / 1000);
        jsonObject.appendField("sub", sub);
        jsonObject.appendField("upn", upn);
        jsonObject.appendField("preferred_username", preferredUsername);

        if (additionalClaims != null) {
            for (Map.Entry<String, String> entry : additionalClaims.entrySet()) {
                jsonObject.appendField(entry.getKey(), entry.getValue());
            }
        }

        JSONArray groupsArr = new JSONArray();
        for (String group : groups) {
            groupsArr.appendElement(group);
        }
        jsonObject.appendField("groups", groupsArr);

        return jsonObject.toJSONString();
    }

}
