//// src/components/chat/tools/NonWalletTools.tsx
//import { useWallet } from "@solana/wallet-adapter-react";
//import { useEffect, useState } from "react";

//interface NonWalletToolProps {
//  toolCallId: string;
//  toolName: string;
//  args: any;
//  addToolResult?: (args: { toolCallId: string; result: string }) => void;
//}

//export default function NonWalletTool({
//  toolCallId,
//  toolName,
//  args,
//  addToolResult,
//}: NonWalletToolProps) {
//  const { publicKey } = useWallet();
//  const userWalletAddress = publicKey?.toString();
//  const [isLoading, setIsLoading] = useState(true);

//  // Utiliser useEffect avec un tableau de dépendances vide pour exécuter une seule fois
//  useEffect(() => {
//    // Créer une fonction asynchrone dans useEffect
//    const executeToolOnce = async () => {
//      console.log(`Executing tool: ${toolName}`, args);

//      try {
//        let result;

//        // Vérifier si l'utilisateur a un portefeuille connecté pour les outils qui en ont besoin
//        if (["addcontact", "getcontact"].includes(toolName.toLowerCase()) && !userWalletAddress) {
//          throw new Error("Wallet connection required to manage contacts");
//        }

//        // Exécuter l'outil en fonction de son nom
//        switch (toolName.toLowerCase()) {
//          case "getweather":
//            result = {
//              success: true,
//              data: {
//                location: args.city,
//                temperature: Math.floor(Math.random() * 30) + 5,
//                condition: ["Sunny", "Cloudy", "Rainy", "Snowy"][Math.floor(Math.random() * 4)],
//              },
//              message: `Weather information for ${args.city}`,
//            };
//            break;

//          case "getlocation":
//            result = {
//              success: true,
//              data: {
//                city: ["New York", "London", "Tokyo", "Paris"][Math.floor(Math.random() * 4)],
//              },
//              message: "Location determined successfully",
//            };
//            break;

//          case "addcontact":
//            // Appeler l'API pour ajouter un contact
//            const addResponse = await fetch("/api/contacts/add", {
//              method: "POST",
//              headers: { "Content-Type": "application/json" },
//              body: JSON.stringify({
//                userWalletAddress,
//                contactName: args.name,
//                contactWalletAddress: args.address,
//              }),
//            });

//            const addData = await addResponse.json();

//            if (!addResponse.ok) {
//              throw new Error(addData.error || "Failed to add contact");
//            }

//            result = addData;
//            break;

//          case "getcontact":
//            // Appeler l'API pour obtenir un contact
//            const getResponse = await fetch(
//              `/api/contacts/get?userWalletAddress=${encodeURIComponent(
//                userWalletAddress || ""
//              )}&contactName=${encodeURIComponent(args.name)}`
//            );

//            const getData = await getResponse.json();

//            if (getResponse.status === 404) {
//              result = {
//                success: false,
//                error: `Contact '${args.name}' not found`,
//                message: `No contact found with name ${args.name}`,
//              };
//            } else if (!getResponse.ok) {
//              throw new Error(getData.error || "Failed to get contact");
//            } else {
//              result = getData;
//            }
//            break;

//          default:
//            // Traitement générique pour les autres outils
//            result = {
//              success: true,
//              data: { executed: true },
//              message: `Tool ${toolName} executed successfully`,
//            };
//        }

//        console.log(`Tool ${toolName} completed with result:`, result);

//        // Renvoyer le résultat à l'IA
//        if (addToolResult) {
//          addToolResult({
//            toolCallId,
//            result: JSON.stringify(result),
//          });
//        }
//      } catch (error: any) {
//        console.error(`Error executing tool ${toolName}:`, error);

//        // Renvoyer l'erreur à l'IA
//        if (addToolResult) {
//          const errorResult = {
//            success: false,
//            error: error.message || "Tool execution failed",
//          };

//          addToolResult({
//            toolCallId,
//            result: JSON.stringify(errorResult),
//          });
//        }
//      } finally {
//        setIsLoading(false);
//      }
//    };

//    // Exécuter la fonction
//    executeToolOnce();
//  }, []); // Dépendances vides = exécution une seule fois

//  // Ne pas retourner d'élément visible - le ToolManager se chargera d'afficher l'état du résultat
//  return null;
//}